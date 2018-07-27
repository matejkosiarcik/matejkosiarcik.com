# shellcheck shell=sh
set -eu
cd "$(dirname "${0}")/../.."

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

# execute deployment scripts
sh "utils/deploy/remove.sh" -u "${user}" -p "${password}"
sh "utils/deploy/copy.sh" -u "${user}" -p "${password}" -d "${path}"
