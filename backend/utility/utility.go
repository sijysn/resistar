package utility

import "strconv"

func ParseStringToUint(str string) (uint, error) {
	parsed, err := strconv.ParseUint(str, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(parsed), nil
}

func ParseUintToString(n uint) string {
	return strconv.FormatUint(uint64(n), 10)
}