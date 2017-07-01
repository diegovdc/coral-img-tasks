const sharp = require('sharp')
const R = require('ramda')
const Task = require('data.task')
const {writeFile} = require('coral-fs-tasks')

//makeThumbnail :: [Int width, Int height] -> Buffer -> Buffer
const makeThumbnail = R.curry((size, buffer) =>
	new Task((reject, resolve) => 
		sharp(buffer)
			.resize(size[0], size[1])
			.toBuffer((err, buffer, info)=>
				err ? reject({error: err, fn: 'img-tasks.makeThumbnail', code:'mkThumbnail'})
					: resolve(buffer)
			)
	) 
)

const writeThumbnail = R.curry((size, path, file) => //pasamos un file como en writeFile
	R.composeK(
		writeFile(path),
		buffer =>Task.of(R.assoc('buffer', buffer, file)), //rearmamos el file con el nuevo buffer
		makeThumbnail(size))
			(file.buffer)//sacamos el buffer
)

module.exports = {
	makeThumbnail,
	writeThumbnail
}