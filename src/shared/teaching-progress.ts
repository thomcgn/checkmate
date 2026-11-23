import type {RepoProgress} from './repository';
/** Step-based estimate, not a model latency guarantee. */
export function estimateRemainingSeconds(progress:RepoProgress,now:number):number|null{
 if(progress.phase!=='analyzing'||progress.total<3||progress.done<2||
  progress.done>=progress.total||progress.startedAt>now||
  !Number.isFinite(progress.done)||!Number.isFinite(progress.total))return null;
 const elapsed=(now-progress.startedAt)/1000;
 if(elapsed<=0)return null;
 const estimate=elapsed/progress.done*(progress.total-progress.done);
 return Number.isFinite(estimate)?Math.min(21600,Math.max(0,Math.ceil(estimate))):null;
}
export function formatDuration(seconds:number):string{
 const value=Math.max(0,Math.floor(seconds));
 const hours=Math.floor(value/3600),minutes=Math.floor(value%3600/60),secs=value%60;
 return hours?hours+' h '+minutes+' min':minutes?minutes+' min '+secs+' s':secs+' s';
}
