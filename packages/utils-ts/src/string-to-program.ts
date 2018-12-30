// tslint:disable typedef
import * as ts from 'typescript';

// tslint:disable-next-line:no-commented-code
// let compilerTriggerTimeoutID = null;
// function triggerCompile() {
//   if (compilerTriggerTimeoutID !== null) {
//     window.clearTimeout(compilerTriggerTimeoutID);
//   }
//   compilerTriggerTimeoutID = window.setTimeout(function() {
//     try {
//       if (!sampleLoaded || !editorLoaded) {
//         console.log('not loaded');
//       }
//       if (typeof output === 'string') {
//         const rhsModel = rhs.editor.getModel();
//         // Save view state
//         const viewState = rhs.editor.saveViewState();
//         // Update content
//         rhsModel.setValue(output);
//         // Remove flicker: force tokenization
//         rhsModel.getLineTokens(rhsModel.getLineCount());
//         // Restore view state
//         rhs.editor.restoreViewState(viewState);
//         // Remove flicker: force rendering
//         rhs.editor.getOffsetForColumn(1, 1);
//       }
//     } catch (e) {
//       console.log('Error from compilation: ' + e + '  ' + (e.stack || ''));
//     }
//   }, 100);
// }

class TranspileOuptut {
  public program: ts.Program;

  private outputText: string = '';

  constructor(inputFileName: string, sourceFile: ts.SourceFile, options: ts.CompilerOptions) {
    const self = this;
    this.program = ts.createProgram([inputFileName], options, {
      getSourceFile(fileName) {
        return fileName.indexOf('module') === 0 ? sourceFile : undefined;
      },
      writeFile(_name, text) {
        self.outputText = text;
      },
      getDefaultLibFileName() {
        return 'lib.d.ts';
      },
      useCaseSensitiveFileNames() {
        return false;
      },
      getCanonicalFileName(fileName) {
        return fileName;
      },
      getCurrentDirectory() {
        return '';
      },
      getNewLine() {
        return '\r\n';
      },
      fileExists(fileName) {
        return fileName === inputFileName;
      },
      readFile() {
        return '';
      },
      directoryExists() {
        return true;
      },
      getDirectories() {
        return [];
      },
    });
  }

  public get output(): string {
    return this.outputText;
  }
}

function transpileModule(input: string, options: ts.CompilerOptions): TranspileOuptut {
  const inputFileName = options.jsx ? 'module.tsx' : 'module.ts';
  const sourceFile = ts.createSourceFile(
    inputFileName,
    input,
    options.target || ts.ScriptTarget.ES5,
  );
  return new TranspileOuptut(inputFileName, sourceFile, options);
}

export default function stringToProgram(input: string): ts.Program {
  const out = transpileModule(input, {
    module: ts.ModuleKind.AMD,
    target: ts.ScriptTarget.ES5,
    noLib: true,
    noResolve: true,
    suppressOutputPathCheck: true,
  });
  return out.program;
}
