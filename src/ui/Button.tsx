import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/app/utils';

const buttonVariants = cva(
  'ease-in-out duration-200',
  {
    variants: {
      variant: {
        none: '',
        primary: 'bg-slate-950 text-slate-50 hover:bg-slate-800 hover:text-white font-semibold ',
        secondary: 'bg-transparent text-slate-950 border-slate-600 border hover:bg-slate-600 hover:text-white font-semibold ',
        ghost: 'bg-transparent opacity-75 hover:scale-125 hover:opacity-100',
        add: 'rounded-full text-center transition-all shadow-md bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-cyan-50 hover:scale-125 hover:rotate-[360deg]',
        action: 'transition-all bg-slate-700 text-slate-50 hover:bg-slate-900 hover:text-white hover:underline ',
        rollUp: 'hover:scale-110 transition-all border-transparent hover:border-slate-500 bg-slate-700 text-slate-50 hover:underline',
        rollDown: 'hover:scale-110 transition-all border-transparent border-slate-500 border bg-slate-50 hover:underline',
        reset: 'hover:scale-110 border-transparent hover:underline',
        top: 'bg-slate-50 text-slate-950 transition-all hover:underline',
      },
      size: {
        none: '',
        main: 'text-lg px-4 py-2 my-2',
        top: 'text-md px-4 py-2 font-bold ',
        std: 'h-10 py-2 px-4',
        progress: 'px-4 py-2 font-bold text-center',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'none',
      size: 'none',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, href, variant, size, ...props }, ref) => {
    if (href) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {children}
        </a>
      )
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }