# shellcheck shell=sh
set -eu
server='binarytrex.com'

# get arguments
while getopts 'u:p:d:' opt; do
    case "${opt}" in
    u) user="${OPTARG}" ;;
    p) password="${OPTARG}" ;;
    d) path="${OPTARG}" ;;
    *) {
        printf 'Unrecognized option: %s\n' "${opt}" >&2
        exit 1
    } ;;
    esac
done

# validate arguments
[ -z "${user}" ] && { printf 'user is missing\n' >&2 && exit 1; }
[ -z "${password}" ] && { printf 'password is missing\n' >&2 && exit 1; }
[ -z "${path}" ] && { printf 'path is missing\n' >&2 && exit 1; }

# get files to upload
commands="$(mktemp)"
find "${path}" -type d -depth 1 -exec printf 'mirror -R %s\n' {} \; >>"${commands}"
find "${path}" -type f -depth 1 -exec printf 'put %s\n' {} \; >>"${commands}"
commands="$(cat "${commands}" && rm -f "${commands}")"

# upload files
lftp -u "${user}.${server},${password}" "sftp://${server}" -e "${commands}; exit" 2>/dev/null
