export type Stage='basics'|'intermediate'|'advanced';
export type Lesson={id:string;title:string;language:string;stage:Stage;minutes:number;summary:string;motivation:string;analogy:string;explanation:string;steps:readonly string[];code:string;walkthrough:string;pitfalls:readonly string[];exercise:string;hint:string;solution:string;takeaway:string;prerequisites:readonly string[];sources:readonly string[]};
export type LearningStatus='unseen'|'learning'|'practicing'|'understood';
export type SavedBook={id:string;title:string;description:string;lessonIds:string[];createdAt:string;updatedAt:string};
export type LearningData={version:1;progress:Record<string,LearningStatus>;notes:Record<string,string>;books:SavedBook[]};
export type AccountState={connected:boolean;sharing:boolean;email:string|null};
export type ModelOption={slug:string;display_name:string};
export type Snapshot={data:LearningData;account:AccountState};
export type TutorRequest={lessonId:string;question:string;model:string};
export interface DesktopApi {load():Promise<Snapshot>;saveProgress(id:string,status:LearningStatus):Promise<LearningData>;saveNote(id:string,text:string):Promise<LearningData>;createBook(title:string,description:string,lessonIds:string[]):Promise<LearningData>;deleteBook(id:string):Promise<LearningData>;signIn():Promise<AccountState>;signOut():Promise<AccountState>;models():Promise<ModelOption[]>;ask(input:TutorRequest):Promise<string>;openExternal(url:string):Promise<void>}
