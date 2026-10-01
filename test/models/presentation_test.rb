require "test_helper"

class PresentationTest < ActiveSupport::TestCase
  def outline(deck)
    deck.parts.map do |part|
      [part.name, part.chapters.map { |chapter| [chapter.name, chapter.slides.map(&:title)] }]
    end
  end

  test "a deck without markers is one unnamed part holding one unnamed chapter" do
    deck = build_deck(slide("A"), slide("B"))

    assert_equal [[nil, [[nil, %w[A B]]]]], outline(deck)
    assert_empty deck.named_parts
  end

  test "a part marker closes the running chapter" do
    deck = build_deck(
      slide("A", chapter: "Intro"), slide("B"),
      slide("C", part: "Week 2"), slide("D", chapter: "Lists")
    )

    assert_equal [
      [nil, [["Intro", %w[A B]]]],
      ["Week 2", [[nil, %w[C]], ["Lists", %w[D]]]]
    ], outline(deck)
    assert_equal ["Intro", nil, "Lists"], deck.chapters.map(&:name)
  end

  test "parts span their chapters" do
    deck = build_deck(slide("A", part: "Week 1", chapter: "Intro"), slide("B", chapter: "AI"), slide("C", part: "Week 2"))
    week1 = deck.find_part("week-1")

    assert_equal [1, 2, 2], [week1.first_position, week1.last_position, week1.size]
    assert_equal %w[A B], week1.slides.map(&:title)
  end

  test "chapter slugs stay unique across parts" do
    deck = build_deck(slide("A", part: "Week 1", chapter: "Intro"), slide("B", part: "Week 2", chapter: "Intro"))

    assert_equal %w[intro intro-2], deck.named_chapters.map(&:slug)
    assert_equal %w[week-1 week-2], deck.named_parts.map(&:slug)
  end

  test "reordering inside a chapter moves the slides, not the boundary" do
    deck = build_deck(slide("A", part: "Week 1", chapter: "Intro"), slide("B"), slide("C", part: "Week 2"))
    deck.reorder!([2, 1, 3])

    assert_equal [["Week 1", [["Intro", %w[B A]]]], ["Week 2", [[nil, %w[C]]]]], outline(deck)
    assert_equal ["Week 1", "Intro"], [deck.slides.first.part, deck.slides.first.chapter]
    assert_nil deck.slides.second.part
    assert_nil deck.slides.second.chapter
  end

  test "a slide dragged into another part joins that part and chapter" do
    deck = build_deck(
      slide("A", part: "Week 1", chapter: "Intro"), slide("B"),
      slide("C", part: "Week 2"), slide("D")
    )
    deck.reorder!([1, 4, 2, 3])

    assert_equal [["Week 1", [["Intro", %w[A D B]]]], ["Week 2", [[nil, %w[C]]]]], outline(deck)
  end

  test "moving a part's first slide hands its markers to the next slide" do
    deck = build_deck(slide("A", part: "Week 1"), slide("B", part: "Week 2", chapter: "Lists"), slide("C"))
    deck.reorder!([1, 3, 2])

    assert_equal [["Week 1", [[nil, %w[A]]]], ["Week 2", [["Lists", %w[C B]]]]], outline(deck)
  end

  test "a new slide inherits the part and chapter it is inserted into" do
    deck = build_deck(slide("A", part: "Week 1", chapter: "Intro"), slide("B", part: "Week 2"))
    created = deck.create_slide!(after_position: 1, body: slide("New"))

    assert_equal 2, created.position
    assert_nil created.part
    assert_equal [["Week 1", [["Intro", %w[A New]]]], ["Week 2", [[nil, %w[B]]]]], outline(deck)
  end

  test "rewriting one marker keeps the other" do
    body = Slide.with_front_matter(slide("A", part: "Week 1"), key: "chapter", value: "Intro")
    body = Slide.with_front_matter(body, key: "center", value: true)

    assert_equal({ "part" => "Week 1", "chapter" => "Intro", "center" => true }, Slide.parse_front_matter(body))
  end
end
