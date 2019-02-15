const chai = require('chai');
const path = require('path');
const child = require('child_process');

const { expect } = chai;
let proc;
const exec = path.join(__dirname, '../..', 'index.js');


describe('Команда date', () => {
    before(() => {
        process.chdir(__dirname);
    });

    beforeEach(() => {
        proc = child.exec('node ' + exec);
    });

    it('должен показывать список todo после определенной даты', (done) => {
        const result = `
  !  |  user      |  date        |  comment              |  fileName       
---------------------------------------------------------------------------
  !  |  Veronika  |  2016-12-25  |  С Наступающим 2017!  |  jsWithTodo.js  
  !  |  Veronika  |  2017-12-25  |  С Наступающим 2018!  |  jsWithTodo.js  
  !  |  Veronika  |  2018-12-25  |  С Наступающим 2019!  |  jsWithTodo.js  
---------------------------------------------------------------------------
`.trim();

        proc.stdout.once('data', function(){
            proc.stdin.write('date 2016\r');
            proc.stdout.once('data', function(output){
                expect(output.toString('utf-8').trim()).to.eq(result);
                done();
            });
        });
    });
});






