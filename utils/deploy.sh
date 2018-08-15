# shellcheck shell=sh
set -eu
cd "$(dirname "${0}")/.."
server='binarytrex.com'

# find build directory
path=''
[ -d 'build' ] && path='build'
[ -d 'dist' ] && path='dist'
[ -z "${path}" ] && { printf 'No build directory found\n' >&2 && exit 1; }

# read credentials
printf 'User prefix: '
read -r user
printf 'Password: '
stty -echo
read -r password
stty echo
printf '\n'

# get files to remove
files_to_remove="$(mktemp)"
lftp -u "${user}.${server},${password}" "sftp://${server}" -e 'ls; exit' |
    rev | cut -d ' ' -f 1 | rev | grep -Ev '^(\.|\.\.)$' | while IFS= read -r file; do
        printf 'rm -r %s;' "${file}" >>"${files_to_remove}"
    done

# remove files
lftp -u "${user}.${server},${password}" "sftp://${server}" -e "$(cat "${files_to_remove}"); exit"
rm -f "${files_to_remove}"

# get files to upload
files_to_upload="$(mktemp)"
find "${path}" -type d -depth 1 -exec printf 'mirror -R %s;' {} \; >>"${files_to_upload}"
find "${path}" -type f -depth 1 -exec printf 'put %s;' {} \; >>"${files_to_upload}"

# upload files
lftp -u "${user}.${server},${password}" "sftp://${server}" -e "$(cat "${files_to_upload}"); exit"
rm -f "${files_to_upload}"
