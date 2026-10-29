# Lab: The Tournament

<div class="cols">

<svg viewBox="0 0 480 400" role="img" aria-label="Payoff table. Both cooperate: 2 points each. Both keep: 0 each. If you keep while they cooperate, you get 3 and they lose 1; the reverse gives you minus 1 and them 3." style="width:100%;height:auto;max-height:62vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:20px">
<text x="300" y="30" text-anchor="middle" font-size="16" fill="#2dd4bf">THEY</text>
<text x="230" y="64" text-anchor="middle" font-size="17" fill="currentColor">cooperate</text>
<text x="380" y="64" text-anchor="middle" font-size="17" fill="currentColor">keep</text>
<text x="20" y="210" font-size="16" fill="#2dd4bf" transform="rotate(-90 26 210)">YOU</text>
<text x="98" y="152" text-anchor="middle" font-size="16" fill="currentColor">cooperate</text>
<text x="98" y="292" text-anchor="middle" font-size="16" fill="currentColor">keep</text>
<rect x="155" y="80" width="150" height="130" rx="8" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<rect x="305" y="80" width="150" height="130" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="155" y="210" width="150" height="130" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="305" y="210" width="150" height="130" rx="8" fill="none" stroke-width="2" style="stroke:var(--md-muted)"/>
<text x="230" y="140" text-anchor="middle" font-size="30" style="fill:var(--md-accent)">2 / 2</text>
<text x="230" y="172" text-anchor="middle" font-size="14" fill="#2dd4bf">trust</text>
<text x="380" y="140" text-anchor="middle" font-size="30" fill="currentColor">-1 / 3</text>
<text x="380" y="172" text-anchor="middle" font-size="14" fill="#2dd4bf">you gave</text>
<text x="230" y="270" text-anchor="middle" font-size="30" style="fill:var(--md-highlight)">3 / -1</text>
<text x="230" y="302" text-anchor="middle" font-size="14" fill="#2dd4bf">you kept</text>
<text x="380" y="270" text-anchor="middle" font-size="30" style="fill:var(--md-muted)">0 / 0</text>
<text x="380" y="302" text-anchor="middle" font-size="14" fill="#2dd4bf">no trust</text>
<text x="240" y="386" text-anchor="middle" font-size="15" style="fill:var(--md-muted)">150-250 rounds per match, every bot vs. every bot</text>
</svg>

<!-- col -->

<div class="code-sm">

```python
class Grudger:
    def __init__(self):
        self.betrayed = False

    def move(self):
        if self.betrayed:
            return "keep"
        return "cooperate"

    def partner_played(self, move):
        if move == "keep":
            self.betrayed = True

    def __repr__(self):
        return "Grudger"
```

</div>

</div>

<!-- notes -->
The trust game from the previous slide, as the bots play it: move() returns "cooperate" (put your coin in) or "keep" (keep it). Scores are you / them, per round.
Whatever your partner does, keeping scores more THIS round (3 > 2, 0 > -1). But if both always keep, both get 0 a round instead of 2. And the game repeats, with memory. That tension is the whole lab.
A bot is any class with move(), partner_played(), and __repr__. partner_played only reports your partner's latest move: the game keeps no history for you. Grudger decides to remember one fact (self.betrayed); that design choice is the encapsulation point. The tournament never checks the class: it just calls the methods (duck typing; more next week). A fresh object per match, so __init__ starts each game clean.
Four example bots, one per file: always_cooperate_bot.py, always_keep_bot.py, coin_flip_bot.py, grudger_bot.py. tournament.py plays every *_bot.py in the folder, so dropping in a friend's file is all it takes. Copycat is NOT among them: it's your secret entry for the class tournament (07_instructor_bot.py).
The flow: (1) finish score.py, then python3 tournament.py plays the example bots. Before that first run, have everyone guess which bot wins; most say Always Keep. (2) Write a bot that beats the examples: rename my_bot.py to yourname_bot.py. (3) Swap files with a neighbor and run again. (4) Upload to Drive for the class tournament.
The obvious strategies are all fair game, and none is simply best: always cooperating gets exploited; always keeping wins against pushovers but scores 0 against anyone who retaliates; alternating is predictable, so a clever bot keeps on your cooperate turns. The best strategy depends on who else is in the room.
Don't tell them yet: Axelrod's tournaments come after the class leaderboard (next slide).
With only the example bots, Always Keep often wins (Coin Flip makes runs vary): lots of exploitable cooperators. In a full class of reciprocating bots, it usually sinks.
