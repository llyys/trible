interface NodeRequire {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
}

// Hot Module Replacement API
//declare var module: { hot: any };
//declare var process: {env:any};

interface NodeModule {
    hot: any
}

interface ReactProps {
  children?: React.ReactNode;
  key?: React.Key;
  className?: string;
}

declare module '*.scss';
declare module '*.md';