namespace :keynote do
  desc "Import a .key file into presentations/ as a markdeck deck. Usage: rake keynote:import FILE=path [NAME=output_name]"
  task import: :environment do
    file = ENV["FILE"] or abort "FILE=path/to/file.key is required"
    name = ENV["NAME"] || File.basename(file, ".key").gsub(/[^a-z0-9_\-]/i, "_").downcase
    require Rails.root.join("lib/keynote_importer").to_s
    KeynoteImporter.new(file, name).run
  end
end
