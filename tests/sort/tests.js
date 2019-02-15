const chai = require('chai');
const path = require('path');
const child = require('child_process');

const { expect } = chai;
let proc;
const exec = path.join(__dirname, '../..', 'index.js');


describe('Команда sort', () => {
    before(() => {
        process.chdir(__dirname);
    });

    beforeEach(() => {
        proc = child.exec('node ' + exec);
    });

    it('должен показывать список todo отсортированный по важности', (done) => {
        const result = `
  !  |  user      |  date        |  comment                              |  fileName       
-------------------------------------------------------------------------------------------
  !  |  pe        |  2018-12-26  |  Работать пора!!!                     |  jsWithTodo.js  
  !  |            |              |  Hi!                                  |  jsWithTodo.js  
  !  |  Veronika  |  2013-12-25  |  С Наступающим 2014!                  |  jsWithTodo.js  
  !  |  Veronika  |  2014-12-25  |  С Наступающим 2015!                  |  jsWithTodo.js  
  !  |  Veronika  |  2015-12-25  |  С Наступающим 2016!                  |  jsWithTodo.js  
  !  |  Veronika  |  2016-12-25  |  С Наступающим 2017!                  |  jsWithTodo.js  
  !  |  Veronika  |  2017-12-25  |  С Наступающим 2018!                  |  jsWithTodo.js  
  !  |  Veronika  |  2018-12-25  |  С Наступающим 2019!                  |  jsWithTodo.js  
     |            |              |  Как дела?                            |  jsWithTodo.js  
     |            |              |  Не понимаю, что здесь происходит...  |  jsWithTodo.js  
-------------------------------------------------------------------------------------------
`.trim();

        proc.stdout.once('data', function(){
            proc.stdin.write('sort importance\r');
            proc.stdout.once('data', function(output){
                expect(output.toString('utf-8').trim()).to.eq(result);
                done();
            });
        });
    });


    it('должен показывать список todo отсортированный по дате', (done) => {
        const result = `
  !  |  user      |  date        |  comment                              |  fileName       
-------------------------------------------------------------------------------------------
  !  |  pe        |  2018-12-26  |  Работать пора!!!                     |  jsWithTodo.js  
  !  |  Veronika  |  2018-12-25  |  С Наступающим 2019!                  |  jsWithTodo.js  
  !  |  Veronika  |  2017-12-25  |  С Наступающим 2018!                  |  jsWithTodo.js  
  !  |  Veronika  |  2016-12-25  |  С Наступающим 2017!                  |  jsWithTodo.js  
  !  |  Veronika  |  2015-12-25  |  С Наступающим 2016!                  |  jsWithTodo.js  
  !  |  Veronika  |  2014-12-25  |  С Наступающим 2015!                  |  jsWithTodo.js  
  !  |  Veronika  |  2013-12-25  |  С Наступающим 2014!                  |  jsWithTodo.js  
  !  |            |              |  Hi!                                  |  jsWithTodo.js  
     |            |              |  Как дела?                            |  jsWithTodo.js  
     |            |              |  Не понимаю, что здесь происходит...  |  jsWithTodo.js  
-------------------------------------------------------------------------------------------
`.trim();

        proc.stdout.once('data', function(){
            proc.stdin.write('sort date\r');
            proc.stdout.once('data', function(output){
                expect(output.toString('utf-8').trim()).to.eq(result);
                done();
            });
        });
    });


    it('должен показывать список todo отсортированный по пользователям', (done) => {
        const result = `
  !  |  user      |  date        |  comment                              |  fileName       
-------------------------------------------------------------------------------------------
  !  |  pe        |  2018-12-26  |  Работать пора!!!                     |  jsWithTodo.js  
  !  |  Veronika  |  2013-12-25  |  С Наступающим 2014!                  |  jsWithTodo.js  
  !  |  Veronika  |  2014-12-25  |  С Наступающим 2015!                  |  jsWithTodo.js  
  !  |  Veronika  |  2015-12-25  |  С Наступающим 2016!                  |  jsWithTodo.js  
  !  |  Veronika  |  2016-12-25  |  С Наступающим 2017!                  |  jsWithTodo.js  
  !  |  Veronika  |  2017-12-25  |  С Наступающим 2018!                  |  jsWithTodo.js  
  !  |  Veronika  |  2018-12-25  |  С Наступающим 2019!                  |  jsWithTodo.js  
  !  |            |              |  Hi!                                  |  jsWithTodo.js  
     |            |              |  Как дела?                            |  jsWithTodo.js  
     |            |              |  Не понимаю, что здесь происходит...  |  jsWithTodo.js  
-------------------------------------------------------------------------------------------
`.trim();

        proc.stdout.once('data', function(){
            proc.stdin.write('sort user\r');
            proc.stdout.once('data', function(output){
                expect(output.toString('utf-8').trim()).to.eq(result);
                done();
            });
        });
    });
});






