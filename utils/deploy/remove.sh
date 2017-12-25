# shellcheck shell=sh
set -eu
server='binarytrex.com'

# get arguments
while getopts 'u:p:' opt; do
    case "${opt}" in
    u) user="${OPTARG}" ;;
    p) password="${OPTARG}" ;;
    esac
done

# validate arguments
[ -z "${user}" ] && { printf 'user is missing\n' >&2 && exit 1; }
[ -z "${password}" ] && { printf 'password is missing\n' >&2 && exit 1; }

# get files to remove
commands="$(mktemp)"
lftp -u "${user}.${server},${password}" "sftp://${server}" -e 'ls; exit' 2>/dev/null |
    rev | cut -d ' ' -f 1 | rev | grep -Ev '^(\.|\.\.)$' | while IFS= read -r file; do
        printf 'rm -r %s\n' "${file}" >>"${commands}"
    done
commands="$(cat "${commands}" && rm -f "${commands}")"

# remove files
lftp -u "${user}.${server},${password}" "sftp://${server}" -e "${commands}; exit" 2>/dev/null
