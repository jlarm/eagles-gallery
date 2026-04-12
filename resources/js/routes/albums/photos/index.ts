import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PhotoController::presign
* @see app/Http/Controllers/PhotoController.php:20
* @route '/albums/{album}/photos/presign'
*/
export const presign = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: presign.url(args, options),
    method: 'post',
})

presign.definition = {
    methods: ["post"],
    url: '/albums/{album}/photos/presign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PhotoController::presign
* @see app/Http/Controllers/PhotoController.php:20
* @route '/albums/{album}/photos/presign'
*/
presign.url = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { album: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { album: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            album: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
    }

    return presign.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoController::presign
* @see app/Http/Controllers/PhotoController.php:20
* @route '/albums/{album}/photos/presign'
*/
presign.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: presign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::presign
* @see app/Http/Controllers/PhotoController.php:20
* @route '/albums/{album}/photos/presign'
*/
const presignForm = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: presign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::presign
* @see app/Http/Controllers/PhotoController.php:20
* @route '/albums/{album}/photos/presign'
*/
presignForm.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: presign.url(args, options),
    method: 'post',
})

presign.form = presignForm

/**
* @see \App\Http\Controllers\PhotoController::reorder
* @see app/Http/Controllers/PhotoController.php:68
* @route '/albums/{album}/photos/reorder'
*/
export const reorder = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/albums/{album}/photos/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PhotoController::reorder
* @see app/Http/Controllers/PhotoController.php:68
* @route '/albums/{album}/photos/reorder'
*/
reorder.url = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { album: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { album: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            album: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
    }

    return reorder.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoController::reorder
* @see app/Http/Controllers/PhotoController.php:68
* @route '/albums/{album}/photos/reorder'
*/
reorder.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::reorder
* @see app/Http/Controllers/PhotoController.php:68
* @route '/albums/{album}/photos/reorder'
*/
const reorderForm = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::reorder
* @see app/Http/Controllers/PhotoController.php:68
* @route '/albums/{album}/photos/reorder'
*/
reorderForm.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

reorder.form = reorderForm

/**
* @see \App\Http\Controllers\PhotoController::store
* @see app/Http/Controllers/PhotoController.php:54
* @route '/albums/{album}/photos'
*/
export const store = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/albums/{album}/photos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PhotoController::store
* @see app/Http/Controllers/PhotoController.php:54
* @route '/albums/{album}/photos'
*/
store.url = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { album: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { album: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            album: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
    }

    return store.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoController::store
* @see app/Http/Controllers/PhotoController.php:54
* @route '/albums/{album}/photos'
*/
store.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::store
* @see app/Http/Controllers/PhotoController.php:54
* @route '/albums/{album}/photos'
*/
const storeForm = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::store
* @see app/Http/Controllers/PhotoController.php:54
* @route '/albums/{album}/photos'
*/
storeForm.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PhotoController::cover
* @see app/Http/Controllers/PhotoController.php:39
* @route '/albums/{album}/photos/{photo}/cover'
*/
export const cover = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cover.url(args, options),
    method: 'post',
})

cover.definition = {
    methods: ["post"],
    url: '/albums/{album}/photos/{photo}/cover',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PhotoController::cover
* @see app/Http/Controllers/PhotoController.php:39
* @route '/albums/{album}/photos/{photo}/cover'
*/
cover.url = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            album: args[0],
            photo: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
        photo: typeof args.photo === 'object'
        ? args.photo.id
        : args.photo,
    }

    return cover.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace('{photo}', parsedArgs.photo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoController::cover
* @see app/Http/Controllers/PhotoController.php:39
* @route '/albums/{album}/photos/{photo}/cover'
*/
cover.post = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cover.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::cover
* @see app/Http/Controllers/PhotoController.php:39
* @route '/albums/{album}/photos/{photo}/cover'
*/
const coverForm = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cover.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::cover
* @see app/Http/Controllers/PhotoController.php:39
* @route '/albums/{album}/photos/{photo}/cover'
*/
coverForm.post = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cover.url(args, options),
    method: 'post',
})

cover.form = coverForm

/**
* @see \App\Http\Controllers\PhotoController::destroy
* @see app/Http/Controllers/PhotoController.php:79
* @route '/albums/{album}/photos/{photo}'
*/
export const destroy = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/albums/{album}/photos/{photo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PhotoController::destroy
* @see app/Http/Controllers/PhotoController.php:79
* @route '/albums/{album}/photos/{photo}'
*/
destroy.url = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            album: args[0],
            photo: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
        photo: typeof args.photo === 'object'
        ? args.photo.id
        : args.photo,
    }

    return destroy.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace('{photo}', parsedArgs.photo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoController::destroy
* @see app/Http/Controllers/PhotoController.php:79
* @route '/albums/{album}/photos/{photo}'
*/
destroy.delete = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PhotoController::destroy
* @see app/Http/Controllers/PhotoController.php:79
* @route '/albums/{album}/photos/{photo}'
*/
const destroyForm = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoController::destroy
* @see app/Http/Controllers/PhotoController.php:79
* @route '/albums/{album}/photos/{photo}'
*/
destroyForm.delete = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\PhotoController::download
* @see app/Http/Controllers/PhotoController.php:96
* @route '/albums/{album}/photos/{photo}/download'
*/
export const download = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/albums/{album}/photos/{photo}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PhotoController::download
* @see app/Http/Controllers/PhotoController.php:96
* @route '/albums/{album}/photos/{photo}/download'
*/
download.url = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            album: args[0],
            photo: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        album: typeof args.album === 'object'
        ? args.album.id
        : args.album,
        photo: typeof args.photo === 'object'
        ? args.photo.id
        : args.photo,
    }

    return download.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace('{photo}', parsedArgs.photo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoController::download
* @see app/Http/Controllers/PhotoController.php:96
* @route '/albums/{album}/photos/{photo}/download'
*/
download.get = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoController::download
* @see app/Http/Controllers/PhotoController.php:96
* @route '/albums/{album}/photos/{photo}/download'
*/
download.head = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PhotoController::download
* @see app/Http/Controllers/PhotoController.php:96
* @route '/albums/{album}/photos/{photo}/download'
*/
const downloadForm = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoController::download
* @see app/Http/Controllers/PhotoController.php:96
* @route '/albums/{album}/photos/{photo}/download'
*/
downloadForm.get = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoController::download
* @see app/Http/Controllers/PhotoController.php:96
* @route '/albums/{album}/photos/{photo}/download'
*/
downloadForm.head = (args: { album: number | { id: number }, photo: number | { id: number } } | [album: number | { id: number }, photo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const photos = {
    presign: Object.assign(presign, presign),
    reorder: Object.assign(reorder, reorder),
    store: Object.assign(store, store),
    cover: Object.assign(cover, cover),
    destroy: Object.assign(destroy, destroy),
    download: Object.assign(download, download),
}

export default photos