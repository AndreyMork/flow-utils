import { codeFrameColumns } from '@babel/code-frame';

export default (path, code) => {
  const bannedAnnotations = ['AnyTypeAnnotation', 'GenericTypeAnnotation'];

  if (path.parent.type === 'TypeAnnotation') {
    const { type } = path;
    if (bannedAnnotations.includes(type)) {
      const { loc } = path.node;
      const result = codeFrameColumns(code, loc, {
        linesAbove: 1,
        linesBelow: 0,
        message: `It's dangerous to use '${type}'`,
        highlightCode: true,
      });
      console.warn(result);
      console.warn();
    }
  }
};
