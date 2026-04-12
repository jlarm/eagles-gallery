import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TournamentController::create
* @see app/Http/Controllers/TournamentController.php:15
* @route '/tournaments/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tournaments/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TournamentController::create
* @see app/Http/Controllers/TournamentController.php:15
* @route '/tournaments/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TournamentController::create
* @see app/Http/Controllers/TournamentController.php:15
* @route '/tournaments/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::create
* @see app/Http/Controllers/TournamentController.php:15
* @route '/tournaments/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TournamentController::create
* @see app/Http/Controllers/TournamentController.php:15
* @route '/tournaments/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::create
* @see app/Http/Controllers/TournamentController.php:15
* @route '/tournaments/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::create
* @see app/Http/Controllers/TournamentController.php:15
* @route '/tournaments/create'
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
* @see \App\Http\Controllers\TournamentController::store
* @see app/Http/Controllers/TournamentController.php:20
* @route '/tournaments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tournaments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TournamentController::store
* @see app/Http/Controllers/TournamentController.php:20
* @route '/tournaments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TournamentController::store
* @see app/Http/Controllers/TournamentController.php:20
* @route '/tournaments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TournamentController::store
* @see app/Http/Controllers/TournamentController.php:20
* @route '/tournaments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TournamentController::store
* @see app/Http/Controllers/TournamentController.php:20
* @route '/tournaments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\TournamentController::manage
* @see app/Http/Controllers/TournamentController.php:32
* @route '/manage/tournaments/{tournament}'
*/
export const manage = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(args, options),
    method: 'get',
})

manage.definition = {
    methods: ["get","head"],
    url: '/manage/tournaments/{tournament}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TournamentController::manage
* @see app/Http/Controllers/TournamentController.php:32
* @route '/manage/tournaments/{tournament}'
*/
manage.url = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tournament: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tournament: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tournament: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tournament: typeof args.tournament === 'object'
        ? args.tournament.id
        : args.tournament,
    }

    return manage.definition.url
            .replace('{tournament}', parsedArgs.tournament.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TournamentController::manage
* @see app/Http/Controllers/TournamentController.php:32
* @route '/manage/tournaments/{tournament}'
*/
manage.get = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::manage
* @see app/Http/Controllers/TournamentController.php:32
* @route '/manage/tournaments/{tournament}'
*/
manage.head = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TournamentController::manage
* @see app/Http/Controllers/TournamentController.php:32
* @route '/manage/tournaments/{tournament}'
*/
const manageForm = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::manage
* @see app/Http/Controllers/TournamentController.php:32
* @route '/manage/tournaments/{tournament}'
*/
manageForm.get = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::manage
* @see app/Http/Controllers/TournamentController.php:32
* @route '/manage/tournaments/{tournament}'
*/
manageForm.head = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TournamentController::destroy
* @see app/Http/Controllers/TournamentController.php:39
* @route '/manage/tournaments/{tournament}'
*/
export const destroy = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/manage/tournaments/{tournament}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TournamentController::destroy
* @see app/Http/Controllers/TournamentController.php:39
* @route '/manage/tournaments/{tournament}'
*/
destroy.url = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tournament: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tournament: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tournament: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tournament: typeof args.tournament === 'object'
        ? args.tournament.id
        : args.tournament,
    }

    return destroy.definition.url
            .replace('{tournament}', parsedArgs.tournament.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TournamentController::destroy
* @see app/Http/Controllers/TournamentController.php:39
* @route '/manage/tournaments/{tournament}'
*/
destroy.delete = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TournamentController::destroy
* @see app/Http/Controllers/TournamentController.php:39
* @route '/manage/tournaments/{tournament}'
*/
const destroyForm = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TournamentController::destroy
* @see app/Http/Controllers/TournamentController.php:39
* @route '/manage/tournaments/{tournament}'
*/
destroyForm.delete = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TournamentController::publish
* @see app/Http/Controllers/TournamentController.php:46
* @route '/manage/tournaments/{tournament}/publish'
*/
export const publish = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/manage/tournaments/{tournament}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TournamentController::publish
* @see app/Http/Controllers/TournamentController.php:46
* @route '/manage/tournaments/{tournament}/publish'
*/
publish.url = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tournament: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tournament: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tournament: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tournament: typeof args.tournament === 'object'
        ? args.tournament.id
        : args.tournament,
    }

    return publish.definition.url
            .replace('{tournament}', parsedArgs.tournament.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TournamentController::publish
* @see app/Http/Controllers/TournamentController.php:46
* @route '/manage/tournaments/{tournament}/publish'
*/
publish.post = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TournamentController::publish
* @see app/Http/Controllers/TournamentController.php:46
* @route '/manage/tournaments/{tournament}/publish'
*/
const publishForm = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TournamentController::publish
* @see app/Http/Controllers/TournamentController.php:46
* @route '/manage/tournaments/{tournament}/publish'
*/
publishForm.post = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

publish.form = publishForm

/**
* @see \App\Http\Controllers\TournamentController::unpublish
* @see app/Http/Controllers/TournamentController.php:53
* @route '/manage/tournaments/{tournament}/unpublish'
*/
export const unpublish = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unpublish.url(args, options),
    method: 'post',
})

unpublish.definition = {
    methods: ["post"],
    url: '/manage/tournaments/{tournament}/unpublish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TournamentController::unpublish
* @see app/Http/Controllers/TournamentController.php:53
* @route '/manage/tournaments/{tournament}/unpublish'
*/
unpublish.url = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tournament: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tournament: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tournament: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tournament: typeof args.tournament === 'object'
        ? args.tournament.id
        : args.tournament,
    }

    return unpublish.definition.url
            .replace('{tournament}', parsedArgs.tournament.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TournamentController::unpublish
* @see app/Http/Controllers/TournamentController.php:53
* @route '/manage/tournaments/{tournament}/unpublish'
*/
unpublish.post = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unpublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TournamentController::unpublish
* @see app/Http/Controllers/TournamentController.php:53
* @route '/manage/tournaments/{tournament}/unpublish'
*/
const unpublishForm = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unpublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TournamentController::unpublish
* @see app/Http/Controllers/TournamentController.php:53
* @route '/manage/tournaments/{tournament}/unpublish'
*/
unpublishForm.post = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unpublish.url(args, options),
    method: 'post',
})

unpublish.form = unpublishForm

/**
* @see \App\Http\Controllers\TournamentController::show
* @see app/Http/Controllers/TournamentController.php:60
* @route '/tournaments/{tournament}'
*/
export const show = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tournaments/{tournament}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TournamentController::show
* @see app/Http/Controllers/TournamentController.php:60
* @route '/tournaments/{tournament}'
*/
show.url = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tournament: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tournament: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tournament: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tournament: typeof args.tournament === 'object'
        ? args.tournament.id
        : args.tournament,
    }

    return show.definition.url
            .replace('{tournament}', parsedArgs.tournament.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TournamentController::show
* @see app/Http/Controllers/TournamentController.php:60
* @route '/tournaments/{tournament}'
*/
show.get = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::show
* @see app/Http/Controllers/TournamentController.php:60
* @route '/tournaments/{tournament}'
*/
show.head = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TournamentController::show
* @see app/Http/Controllers/TournamentController.php:60
* @route '/tournaments/{tournament}'
*/
const showForm = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::show
* @see app/Http/Controllers/TournamentController.php:60
* @route '/tournaments/{tournament}'
*/
showForm.get = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TournamentController::show
* @see app/Http/Controllers/TournamentController.php:60
* @route '/tournaments/{tournament}'
*/
showForm.head = (args: { tournament: number | { id: number } } | [tournament: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const tournaments = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    manage: Object.assign(manage, manage),
    destroy: Object.assign(destroy, destroy),
    publish: Object.assign(publish, publish),
    unpublish: Object.assign(unpublish, unpublish),
    show: Object.assign(show, show),
}

export default tournaments