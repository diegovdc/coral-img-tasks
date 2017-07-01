const expect = require("chai").expect
const R = require('ramda')

const {makeThumbnail, writeThumbnail} = require('../img-tasks')

const {unlinkFile, readToBuffer} = require('coral-fs-tasks')


describe('Image processingTasks Library', () => {

	let file

	before((done) => { 
		readToBuffer(__dirname + '/fs-tasks-files/img1.jpg').fork(done, data => {
			file = data
			done()
		});
	});

	afterEach(done => {
		unlinkFile(__dirname + '/fs-tasks-files/dest/myfile_thumbnail.jpg').fork(e => {
			e.code === 'ENOENT' ? done() : console.log(e)
		}, s => done())
	});

	after(done => {
		done()
	});

	describe('makeThumbnail :: [Int width, Int height] -> Buffer -> Buffer', () => {
		it('creates a buffer of a thumbnail image', (done) => {
			makeThumbnail([200, 200], file).fork(done, data => {
				expect(Buffer.isBuffer(data)).to.eql(true)
				done()
			});
		});
	});	

	describe('writeThumbnail :: [Int width, Int height] -> String filepath -> Buffer -> Buffer', () => {
		it('creates a buffer of a thumbnail image', (done) => {
			writeThumbnail([200, 200], __dirname + '/fs-tasks-files/dest/', {filename: 'myfile_thumbnail.jpg', buffer: file}).fork(done, data => {
				readToBuffer(__dirname + '/fs-tasks-files/dest/myfile_thumbnail.jpg').fork(done, 
					r => {
						expect(Buffer.isBuffer(r)).to.eql(true)
						done()
					}
				)
			});
		});
	});		
});
