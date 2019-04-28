# shellcheck shell=sh
set -euf
cd "$(dirname "${0}")/.."
server='binarytrex.com'

# find build directory
path='build/prod'
if [ ! -d "${path}" ]; then
    printf 'directory "build/prod/" NOT found\n' >&2
    exit 1
fi

# read credentials
printf 'User prefix: '
read -r user
printf 'Password: '
stty -echo
read -r password
stty echo
printf '\n'

credentials="${user}.${server},${password}"

# get files to remove
files_to_remove="$(mktemp)"
lftp -u "${credentials}" "sftp://${server}" -e 'ls; exit' |
    rev | cut -d ' ' -f 1 | rev | grep -Ev '^(\.|\.\.)$' | while IFS= read -r file; do
        printf 'rm -r %s;' "${file}" >>"${files_to_remove}"
    done

# remove files
lftp -u "${credentials}" "sftp://${server}" -e "$(cat "${files_to_remove}"); exit"
rm -f "${files_to_remove}"

# get files to upload
files_to_upload="$(mktemp)"
find "${path}" -type d -depth 1 -exec printf 'mirror -R %s;' {} \; >>"${files_to_upload}"
find "${path}" -type f -depth 1 -exec printf 'put %s;' {} \; >>"${files_to_upload}"

# upload files
lftp -u "${credentials}" "sftp://${server}" -e "$(cat "${files_to_upload}"); exit"
rm -f "${files_to_upload}"
