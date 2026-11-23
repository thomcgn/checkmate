import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateRemainingSeconds,formatDuration} from '../src/shared/teaching-progress.ts';
import type {RepoProgress} from '../src/shared/repository.ts';
const progress:RepoProgress={phase:'analyzing',done:2,total:6,detail:'Kapitel',startedAt:1000};
test('ETA is based on completed steps and elapsed time, not invented model speed',()=>{
 assert.equal(estimateRemainingSeconds(progress,61000),120);
 assert.equal(estimateRemainingSeconds({...progress,done:1},61000),null);
 assert.equal(estimateRemainingSeconds({...progress,done:6},61000),null);
 assert.equal(estimateRemainingSeconds({...progress,phase:'done'},61000),null);
 assert.equal(estimateRemainingSeconds(progress,0),null);
 assert.equal(estimateRemainingSeconds(progress,100000000),21600);
});
test('progress displays bounded durations',()=>{
 assert.equal(formatDuration(0),'0 s');
 assert.equal(formatDuration(75),'1 min 15 s');
 assert.equal(formatDuration(3750),'1 h 2 min');
});
