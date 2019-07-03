const fs = require('fs')
const glob = require('glob')

for (const fileName of glob.sync('*.kicad_mod')) {
	let content = fs.readFileSync(fileName, { encoding: 'utf8' }).split('\n')

	let reference = content.findIndex(a => a.includes('reference'))

	content.splice(reference, 0,
		content[reference]
		.replace('reference REF**', 'user %R')
		.replace('Dwgs.User', 'F.SilkS'),
		content[reference + 1],
		content[reference + 2],
	)

	for (let i = 0; i < content.length; ++i) {
		let line = content[i]
		if (line.includes('fp_line')) {
			let words = line.split(' ').filter(a => a.trim() != '')

			let start = words.findIndex(a => a.includes('start'))
			start = [parseInt(words[start + 1], 10), parseInt(words[start + 2], 10)]

			let end = words.findIndex(a => a.includes('end'))
			end = [parseInt(words[end + 1], 10), parseInt(words[end + 2], 10)]

			let length1 = Math.abs(start[0] - end[0])
			let length2 = Math.abs(start[1] - end[1])

			if ((length1 === 2 && length2 === 0) || (length1 === 0 && length2 === 2)) {
				content.splice(i + 1, 0, line.replace('Dwgs.User', 'F.SilkS'))
				++i
			}

		}
	}

	fs.writeFileSync(fileName, content.join('\n'))
}
