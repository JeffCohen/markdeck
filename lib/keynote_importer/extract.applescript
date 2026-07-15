-- Extracts text + tables + presenter notes from a Keynote file,
-- and exports per-slide PNG images.
-- Usage: osascript extract.applescript <keyPath> <dataDir> <imgDir>

on run argv
	set keyPath to item 1 of argv
	set outDir to item 2 of argv
	set imgDir to item 3 of argv

	tell application "Keynote"
		activate
		set doc to open POSIX file keyPath
		delay 1

		-- Export per-slide PNGs (one folder of images)
		try
			export doc to POSIX file imgDir as slide images with properties {image format:PNG, export style:IndividualSlides, skipped slides:true}
		on error errMsg
			log "Image export failed: " & errMsg
		end try

		set slideCount to count of slides of doc

		-- Write a manifest so Ruby knows how many slides to expect
		my writeFile(outDir & "/manifest.txt", "slide_count=" & slideCount & linefeed)

		repeat with i from 1 to slideCount
			set theSlide to slide i of doc
			set padded to my pad(i)

			-- Title
			try
				if title showing of theSlide then
					set titleText to (object text of default title item of theSlide) as text
					if titleText is not "" then
						my writeFile(outDir & "/slide-" & padded & "-title.txt", titleText)
					end if
				end if
			end try

			-- Body (bullets)
			try
				if body showing of theSlide then
					set bodyText to (object text of default body item of theSlide) as text
					if bodyText is not "" then
						my writeFile(outDir & "/slide-" & padded & "-body.txt", bodyText)
					end if
				end if
			end try

			-- Presenter notes
			try
				set notesText to (presenter notes of theSlide) as text
				if notesText is not "" then
					my writeFile(outDir & "/slide-" & padded & "-notes.txt", notesText)
				end if
			end try

			-- Tables
			try
				set tableCount to count of tables of theSlide
				repeat with t from 1 to tableCount
					set theTable to table t of theSlide
					set tablePadded to my pad(t)
					set tsv to my tableToTSV(theTable)
					if tsv is not "" then
						my writeFile(outDir & "/slide-" & padded & "-table-" & tablePadded & ".tsv", tsv)
					end if
				end repeat
			end try

			-- Meta
			set metaText to "slide=" & i & linefeed & "skipped=" & (skipped of theSlide as text) & linefeed
			my writeFile(outDir & "/slide-" & padded & "-meta.txt", metaText)
		end repeat

		close doc saving no
	end tell
end run

on pad(n)
	set s to n as text
	if (count of s) < 2 then set s to "0" & s
	return s
end pad

on writeFile(path, content)
	set fh to open for access POSIX file path with write permission
	try
		set eof of fh to 0
		write content to fh as «class utf8»
		close access fh
	on error errMsg
		try
			close access fh
		end try
		error "writeFile failed for " & path & ": " & errMsg
	end try
end writeFile

on tableToTSV(theTable)
	set tsv to ""
	tell application "Keynote"
		set rowCount to row count of theTable
		set colCount to column count of theTable
		repeat with r from 1 to rowCount
			set rowText to ""
			repeat with c from 1 to colCount
				set cellVal to ""
				try
					set fv to formatted value of cell c of row r of theTable
					if fv is not missing value then set cellVal to fv as text
				end try
				-- Strip any embedded tabs/newlines so they don't break TSV
				set cellVal to my cleanCell(cellVal)
				set rowText to rowText & cellVal
				if c < colCount then set rowText to rowText & tab
			end repeat
			set tsv to tsv & rowText & linefeed
		end repeat
	end tell
	return tsv
end tableToTSV

on cleanCell(s)
	set s to my replaceText(s, tab, " ")
	set s to my replaceText(s, return, " ")
	set s to my replaceText(s, linefeed, " ")
	return s
end cleanCell

on replaceText(theText, searchString, replacementString)
	set AppleScript's text item delimiters to searchString
	set theItems to text items of theText
	set AppleScript's text item delimiters to replacementString
	set theResult to theItems as text
	set AppleScript's text item delimiters to ""
	return theResult
end replaceText
