const chai = require('chai');
const path = require('path');
const child = require('child_process');

const { expect } = chai;
let proc;
const exec = path.join(__dirname, '..', 'index.js');


describe('Базовые проверки', () => {
    beforeEach(() => {
        proc = child.exec('node ' + exec);
    });


    it('должен писать приветственное сообщение', (done) => {
        proc.stdout.once('data', (output) => {
            expect(output.toString('utf-8')).to.eq('Please, write your command!\n');
            done();
        });
    });

    it('должен писать об ошибочной команде', (done) => {
        proc.stdout.once('data', function(){
            proc.stdin.write('hi!\r');
            proc.stdout.once('data', function(output){
                expect(output.toString('utf-8')).to.eq('wrong command\n');
                done();
            });
        });
    });

    it('должен завершать процесс после команды exit', (done) => {
        proc.stdout.once('data', function(){
            proc.stdin.write('exit\r');
            proc.once('exit', function (code) {
                expect(code).to.eq(0);
                done();
            });
        });
    });
});






