#Using NodeWebkit

https://github.com/nwjs/nw.js/wiki/How-to-run-apps

##Mac OS X

On Mac OSX, a folder or .nw file can be dropped onto the nw.app application bundle. On the Mac OSX Terminal (commandline), you can use nw like this (assuming it's installed to the Applications directory):

open -n -a nwjs "/home/path/to/app" 

In some cases it may be faster to invoke the nw binary inside the application bundle directly via the following:

/Applications/nwjs.app/Contents/MacOS/nwjs myapp 
You can setup an alias in your Terminal session to call the binary when you use nw by adding an alias to your ~/.bash_profile (open -a TextEdit ~/.bash_profile):

# alias to nw
alias nw="/Applications/nwjs.app/Contents/MacOS/nwjs"
You have to refresh the bash shell environment:

source ~/.bash_profile
Now you can call nw from the commandline like Linux and Windows:

nw "/home/path/to/game" 