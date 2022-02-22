def normalize_booleans(arr) -> bool:
    filtered = filter(lambda item: item is not None, arr)
    booleans = list(filtered)

    if not len(booleans):
        return False

    product = booleans[0]

    for boolean in booleans:
        product = product and boolean

    return product
