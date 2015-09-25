The boxes/ directory contains Vagrant boxes. A subdirectory in boxes/ should be
named after the organization providing the boxes it contains. The box files in
each subdirectory should use the public name of the box with a .box extension.
For example, the box-cutter/centos67 box should be downloaded to
boxes/box-cutter/centos67.box.

Boxes should *never* be added to git; they're too big and they don't really
need to be versioned anyway.
