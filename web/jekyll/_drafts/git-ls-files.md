---
---
# Efficiently listing files in a git repository

[TL;DR](#put-it-in-a-script)

Recently I have been working on my little side project [azlint](https://github.com/matejkosiarcik/azlint) where I need to run external programs on project files.
To do that I need to tell these programs which files to analyze.

Before we start, let's create a little playground where we can check things.

```bash
mkdir git-example && cd git-example
git init

# let's commit some files
touch commited.txt
touch commited-deleted.txt
echo 'ignored.txt' >'.gitignore'
git add commited.txt commited-deleted.txt .gitignore
git commit -m 'Initial commit'
rm -f commited-deleted.txt

# let's stage (not commit) some files
touch staged.txt
touch staged-deleted.txt
git add staged.txt staged-deleted.txt
rm -f staged-deleted.txt

# just recently added file
touch ignored.txt
touch dirty.txt
```

It is a little longer, but the setup will be worth it.
This script creates new git repository with few files to validate our results.
I hope the file names are descriptive enough.
When I list files, I want to see the following:

- .gitignore
- commited.txt
- staged.txt
- dirty.txt

## glob

I could just glob files right?
It is simple, built into every shell in existence.

```bash
$ echo **/*
commited.txt dirty.txt ignored.txt staged.txt
```

Not bad for first try.
Only the `ignored.txt` file should not be there. And it's missing so called "hidden" files like `.gitignore`.

```bash
$ echo **/* **/.*
commited.txt dirty.txt ignored.txt staged.txt .git .gitignore
```

Now we got our `.gitignore`, but also `.git` directory.
Bummer.

## find

A slight improvement is to use `find` instead.

```bash
find '.' -type f -not -path '*.git/*'
./dirty.txt
./.gitignore
./staged.txt
./commited.txt
./ignored.txt
```

Which solves `.git`, but still leaves `ignored.txt`.

## git ls-files

Git has this wonderful subcommand `ls-files`, which as it says, lists files.

```bash
$ git ls-files
.gitignore
commited-deleted.txt
commited.txt
staged-deleted.txt
staged.txt
```

Hmm, progress?
We got rid of `ignored.txt` and unecessarily of `.gitignore`, but also introduced `commited-deleted.txt` and `staged-deleted.txt` which is a step back.
We can pass our custom pattern to `git ls-files` to also include hidden files (works recursively automatically).

```bash
$ git ls-files '*' '.*'
.gitignore
commited-deleted.txt
commited.txt
staged-deleted.txt
staged.txt
```

We got back our `.gitignore`, but the rest remains as before.
We can eleminate the non-existing files with passing concrete file names by shell globbing.

```bash
$ git ls-files **/* **/.*
.gitignore
commited.txt
staged.txt
```

This works because shell resolves the glob patterns into concrete file paths (notice no **\'** around arguments) before passing it to our git command.
Problem 1 our `dirty.txt` is still missing.
Problem 2 if you try it on a real repository, this is probably what you'll see:

```bash
$ git ls-files **/* **/.*
zsh: argument list too long: git
```

Turns out you can't pass unlimited amount of arguments to commands. <!-- TODO: put footnote -->
To find your platform's limit run `getconf ARG_MAX`.

> in my experience *ls-tree* can be used in the same way as plain *ls-files* via `git ls-tree --full-tree -r --name-only HEAD`.

## git check-ignore

Another wonderful subcommand is `git check-ignore`.
We can reuse our find command and check each file if it's ignored.

```bash
$ find '.' -type f -not -path '*.git/*' | while IFS= read -r file; do
$     git check-ignore "${file}" >/dev/null || echo "${file}"
$ done
./dirty.txt
./.gitignore
./staged.txt
./commited.txt
```

Eureka!?
Except the performance really sucks.
Spawning git command for each individual file is... not ideal.
Think of all the files in `node_modules/` it has to check (hint [It's going to be a long long time](https://www.youtube.com/watch?v=BdEe5SpdIuo)).

## Custom script with git check-ignore

We can improve previous snippet by batching files to check-ignore (minding the ARG\_MAX limit).
But this apporoaches complexity not suitable for shell scripts (subjetive opinion).
We can try with NodeJS (hold your criticism, it doesn't really matter what language we choose for this small script).

```js
#!/usr/bin/env node
const glob = require('glob') // npm package
const git = require('simple-git/promise'); // npm package

(async () => {
    const repo = git('.')
    let allFiles = glob.sync('**/*', { nodir: true, dot: true, ignore: '.git/**/*' })
    while (allFiles.length > 0) {
        const currentFiles = allFiles.splice(0, 1000)
        const currentIgnoredFiles = await repo.checkIgnore(currentFiles)
        for (let file of currentFiles.filter(file => !currentIgnoredFiles.includes(file))) {
            console.log(file)
        }
    }
})()
```

This batches found files by thousand (you can make this limit dynamic, it depends on ARG\_MAX, I didn't feel like it ¯\\_(ツ)_/¯).
It runs great even on big repositories.
However what I observed is that git ls-files still runs several magnitudes quicker.

## git ls-files again

I was not satisfied with the solution so I turned to googling, stackoverflow and `git ls-files --help` to check if I can configure it to behave.
What I found is not amazing, but still encouraging.

I found the following combination:

```sh
$ git ls-files
.gitignore
commited-deleted.txt
commited.txt
staged-deleted.txt
staged.txt
```

```sh
$ git ls-files --deleted
commited-deleted.txt
staged-deleted.txt
```

```sh
$ git ls-files --others --exclude-standard
dirty.txt
```

And it runs blazingly fast as well.
All three invocations together take somewhere between 1% and 20% of my check-ignore based script.
What I can do with that is start with `git ls-files`, subtract `git ls-files --deleted`, add `git ls-files --others --exclude-standard` and we have complete list of files.

### Put it in a script

<!-- TODO: make new js script -->
