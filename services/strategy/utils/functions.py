def normalize_booleans(arr) -> bool:
    if not len(arr) or False in arr:
        return False
    return True
