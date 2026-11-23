export type LessonSection={title:string;explanation:string;sourcePaths:string[];exercise:string;solution:string};
export type TeachingBook={version:1;title:string;learningGoals:string[];chapters:LessonSection[];coverage:{included:number;total:number;limited:boolean}};
export type RepositoryPreview={repository:string;head:string;files:number;included:number;bytes:number;samplePaths:readonly string[];excluded:number;source:string};
export type RepositoryAnalysis={id:string;repository:string;head:string;title:string;createdAt:string;model:string;files:number;includedPaths:string[];markdown:string;teachingBook?:TeachingBook};
export type RepoProgress={phase:'fetching'|'analyzing'|'saving'|'done'|'failed';done:number;total:number;detail:string;startedAt:number};
export type ChatGPTModel={slug:string;display_name:string};
export type ChatGPTStatus={available:boolean;connected:boolean;sharing:boolean;email:string|null;plan:string|null;detail:string};
export type RepoBridge={
 preview(url:string):Promise<RepositoryPreview>;
 chatgptStatus():Promise<ChatGPTStatus>;
 signIn():Promise<ChatGPTStatus>;
 signOut():Promise<ChatGPTStatus>;
 models():Promise<ChatGPTModel[]>;
 analyze(url:string,consent:boolean,model:string):Promise<RepositoryAnalysis>;
 analyzeDocument(packId:string,documentPath:string,consent:boolean,model:string):Promise<RepositoryAnalysis>;
 saved():Promise<RepositoryAnalysis[]>;
 remove(id:string):Promise<void>;
 onProgress(callback:(value:RepoProgress)=>void):()=>void;
};
