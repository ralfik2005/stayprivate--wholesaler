/** Example file/folder data. */
export const files = [
  {
    name: 'components',
    size: '100',
    type: 'folder',
    children: [
      {
        name: 'src',
        size: '1076',
        type: 'folder',
        children: [
          {
            name: 'cdk',
            size: '21',
            type: 'folder',
            children: [
              { name: 'package.json', type: 'file' },
              { name: 'BUILD.bazel', type: 'file' },
            ]
          },
          { name: 'material', type: 'folder' }
        ]
      }
    ]
  },
  { name: 'feefe', type: 'file' },
  {
    name: 'angular',
    type: 'folder',
    children: [
      {
        name: 'packages',
        type: 'folder',
        children: [
          { name: '.travis.yml', type: 'file' },
          { name: 'firebase.json', type: 'file' }
        ]
      },
      { name: 'package.json', type: 'file' }
    ]
  },
  {
    name: 'angularjs',
    type: 'folder',
    children: [
      { name: 'gulpfile.js', type: 'file' },
      { name: 'README.md', type: 'file' }
    ]
  }
];
