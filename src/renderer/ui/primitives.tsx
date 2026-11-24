import React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva,type VariantProps} from 'class-variance-authority';
import clsx,{type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...values:ClassValue[]):string{return twMerge(clsx(values));}

export const buttonVariants=cva(
 'cm-button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cm-cyan)] disabled:pointer-events-none disabled:opacity-50',
 {variants:{variant:{
  default:'border-[var(--cm-violet)] bg-[var(--cm-violet)] text-[var(--cm-ink)] hover:bg-[var(--cm-lilac)]',
  secondary:'border-[var(--cm-border)] bg-[var(--cm-raised)] text-[var(--cm-text)] hover:border-[var(--cm-violet)] hover:bg-[var(--cm-panel)]',
  ghost:'border-transparent bg-transparent text-[var(--cm-muted)] hover:bg-[var(--cm-raised)] hover:text-[var(--cm-text)]',
  accent:'border-[var(--cm-gold)] bg-[var(--cm-gold)] text-[var(--cm-ink)] hover:bg-[#ffe0a2]'
 },size:{default:'h-11 px-4',sm:'h-11 px-3 text-xs',icon:'h-11 w-11 p-0'}},defaultVariants:{variant:'default',size:'default'}}
);
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof buttonVariants>{
 asChild?:boolean;
}
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(function Button({className,variant,size,asChild=false,type='button',...props},ref){
 const Comp=asChild?Slot:'button';
 return <Comp ref={ref} type={asChild?undefined:type} className={cn(buttonVariants({variant,size,className}))} {...props}/>;
});
export function Surface({children,className,...props}:React.HTMLAttributes<HTMLElement>):React.JSX.Element{
 return <section className={cn('rounded-xl border border-[var(--cm-border)] bg-[var(--cm-panel)]',className)} {...props}>{children}</section>;
}
