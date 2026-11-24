import React from 'react';
import {Moon,Sun} from 'lucide-react';
import {Button} from './primitives';
import {useTheme} from '../theme';

/** shadcn-style icon toggle in the topbar; the pressed state describes the light mode. */
export function ThemeToggle():React.JSX.Element{
 const [theme,toggle]=useTheme();
 const light=theme==='light';
 return <Button variant="ghost" size="icon" className="cm-theme-toggle"
  aria-label="Heller Modus" aria-pressed={light}
  title={light?'Zum dunklen Modus wechseln':'Zum hellen Modus wechseln'}
  onClick={toggle}>
  {light?<Moon size={18} aria-hidden="true"/>:<Sun size={18} aria-hidden="true"/>}
 </Button>;
}
