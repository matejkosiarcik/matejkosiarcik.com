# shellcheck shell=sh
set -eu
cd "$(dirname "${0}")/.."

# find build directory
path=""
[ -d "build/release" ] && { path="build/release"; }
[ -d "build/debug" ] && { path="build/debug"; }
[ -z "${path}" ] && { printf "%s\n" "No build directory found" >&2 && exit 1; }

# read credentials
printf "User prefix: "
read -r user
printf "Password: "
stty -echo
read -r password
stty echo
printf "\n"

# execute deployment scripts
sh "utils/internal/remove.sh" -u "${user}" -p "${password}"
sh "utils/internal/copy.sh" -u "${user}" -p "${password}" -d "build/debug"
