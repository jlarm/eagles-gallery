import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AlbumController::create
* @see app/Http/Controllers/AlbumController.php:16
* @route '/albums/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/albums/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlbumController::create
* @see app/Http/Controllers/AlbumController.php:16
* @route '/albums/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlbumController::create
* @see app/Http/Controllers/AlbumController.php:16
* @route '/albums/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::create
* @see app/Http/Controllers/AlbumController.php:16
* @route '/albums/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AlbumController::create
* @see app/Http/Controllers/AlbumController.php:16
* @route '/albums/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::create
* @see app/Http/Controllers/AlbumController.php:16
* @route '/albums/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::create
* @see app/Http/Controllers/AlbumController.php:16
* @route '/albums/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\AlbumController::store
* @see app/Http/Controllers/AlbumController.php:23
* @route '/albums'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/albums',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlbumController::store
* @see app/Http/Controllers/AlbumController.php:23
* @route '/albums'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlbumController::store
* @see app/Http/Controllers/AlbumController.php:23
* @route '/albums'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlbumController::store
* @see app/Http/Controllers/AlbumController.php:23
* @route '/albums'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlbumController::store
* @see app/Http/Controllers/AlbumController.php:23
* @route '/albums'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AlbumController::manage
* @see app/Http/Controllers/AlbumController.php:37
* @route '/manage/albums/{album}'
*/
export const manage = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(args, options),
    method: 'get',
})

manage.definition = {
    methods: ["get","head"],
    url: '/manage/albums/{album}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlbumController::manage
* @see app/Http/Controllers/AlbumController.php:37
* @route '/manage/albums/{album}'
*/
manage.url = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return manage.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlbumController::manage
* @see app/Http/Controllers/AlbumController.php:37
* @route '/manage/albums/{album}'
*/
manage.get = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::manage
* @see app/Http/Controllers/AlbumController.php:37
* @route '/manage/albums/{album}'
*/
manage.head = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AlbumController::manage
* @see app/Http/Controllers/AlbumController.php:37
* @route '/manage/albums/{album}'
*/
const manageForm = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::manage
* @see app/Http/Controllers/AlbumController.php:37
* @route '/manage/albums/{album}'
*/
manageForm.get = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::manage
* @see app/Http/Controllers/AlbumController.php:37
* @route '/manage/albums/{album}'
*/
manageForm.head = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manage.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manage.form = manageForm

/**
* @see \App\Http\Controllers\AlbumController::destroy
* @see app/Http/Controllers/AlbumController.php:53
* @route '/manage/albums/{album}'
*/
export const destroy = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/manage/albums/{album}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AlbumController::destroy
* @see app/Http/Controllers/AlbumController.php:53
* @route '/manage/albums/{album}'
*/
destroy.url = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlbumController::destroy
* @see app/Http/Controllers/AlbumController.php:53
* @route '/manage/albums/{album}'
*/
destroy.delete = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AlbumController::destroy
* @see app/Http/Controllers/AlbumController.php:53
* @route '/manage/albums/{album}'
*/
const destroyForm = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlbumController::destroy
* @see app/Http/Controllers/AlbumController.php:53
* @route '/manage/albums/{album}'
*/
destroyForm.delete = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AlbumController::publish
* @see app/Http/Controllers/AlbumController.php:65
* @route '/manage/albums/{album}/publish'
*/
export const publish = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/manage/albums/{album}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlbumController::publish
* @see app/Http/Controllers/AlbumController.php:65
* @route '/manage/albums/{album}/publish'
*/
publish.url = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return publish.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlbumController::publish
* @see app/Http/Controllers/AlbumController.php:65
* @route '/manage/albums/{album}/publish'
*/
publish.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlbumController::publish
* @see app/Http/Controllers/AlbumController.php:65
* @route '/manage/albums/{album}/publish'
*/
const publishForm = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlbumController::publish
* @see app/Http/Controllers/AlbumController.php:65
* @route '/manage/albums/{album}/publish'
*/
publishForm.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

publish.form = publishForm

/**
* @see \App\Http\Controllers\AlbumController::unpublish
* @see app/Http/Controllers/AlbumController.php:72
* @route '/manage/albums/{album}/unpublish'
*/
export const unpublish = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unpublish.url(args, options),
    method: 'post',
})

unpublish.definition = {
    methods: ["post"],
    url: '/manage/albums/{album}/unpublish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlbumController::unpublish
* @see app/Http/Controllers/AlbumController.php:72
* @route '/manage/albums/{album}/unpublish'
*/
unpublish.url = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return unpublish.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlbumController::unpublish
* @see app/Http/Controllers/AlbumController.php:72
* @route '/manage/albums/{album}/unpublish'
*/
unpublish.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unpublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlbumController::unpublish
* @see app/Http/Controllers/AlbumController.php:72
* @route '/manage/albums/{album}/unpublish'
*/
const unpublishForm = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unpublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlbumController::unpublish
* @see app/Http/Controllers/AlbumController.php:72
* @route '/manage/albums/{album}/unpublish'
*/
unpublishForm.post = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unpublish.url(args, options),
    method: 'post',
})

unpublish.form = unpublishForm

/**
* @see \App\Http\Controllers\AlbumController::show
* @see app/Http/Controllers/AlbumController.php:79
* @route '/albums/{album}'
*/
export const show = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/albums/{album}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlbumController::show
* @see app/Http/Controllers/AlbumController.php:79
* @route '/albums/{album}'
*/
show.url = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{album}', parsedArgs.album.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlbumController::show
* @see app/Http/Controllers/AlbumController.php:79
* @route '/albums/{album}'
*/
show.get = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::show
* @see app/Http/Controllers/AlbumController.php:79
* @route '/albums/{album}'
*/
show.head = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AlbumController::show
* @see app/Http/Controllers/AlbumController.php:79
* @route '/albums/{album}'
*/
const showForm = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::show
* @see app/Http/Controllers/AlbumController.php:79
* @route '/albums/{album}'
*/
showForm.get = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlbumController::show
* @see app/Http/Controllers/AlbumController.php:79
* @route '/albums/{album}'
*/
showForm.head = (args: { album: number | { id: number } } | [album: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const AlbumController = { create, store, manage, destroy, publish, unpublish, show }

export default AlbumController