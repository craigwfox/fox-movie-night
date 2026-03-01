# Plan: Add Movie Form with React Hook Form

Build a comprehensive add-movie form using react-hook-form with two sections: watch information and TMDB movie data. The form will search TMDB, allow selecting a movie result to auto-populate fields, and save the combined data to Supabase.

## Steps

1. **Implement missing form components** — Complete [SelectInput](src/components/common/form-inputs/select-input/select-input.tsx) and [Textarea](src/components/common/form-inputs/textarea/textarea.tsx) components with react-hook-form compatibility (using `register` or `Controller` API), following the pattern in [TextInput](src/components/common/form-inputs/text-input/text-input.tsx).

2. **Create form with react-hook-form** — In [add-movie/page.tsx](src/app/add-movie/page.tsx), set up `useForm` hook with TypeScript types for all fields (watch_name, watch_date, craig_pick, craig_rating, rebecca_rating, slug, imdb_id, tmdb_id, release_date, director, top_cast, genre, user_score, poster_path, backdrop_path, overview), connect inputs to form, and add TMDB search button that calls [/api/search](src/app/api/search/route.ts).

3. **Build TMDB results display** — Implement [tmdb-results-list.tsx](src/components/add-movie/tmdb-results/tmdb-results-list.tsx) and [tmdb-result-item.tsx](src/components/add-movie/tmdb-results/tmdb-result-item.tsx) to show search results with poster, title, and release date, with a button to auto-populate form fields using `setValue` from react-hook-form.

4. **Create database insertion** — Add `insertMovie()` function in [queries.ts](src/utils/supabase/queries.ts) and create POST handler in [movies/route.ts](src/app/api/movies/route.ts) that transforms array fields (director, top_cast, genre) to comma-separated strings and generates slug from movie name.

5. **Add form submission** — Wire up form's `onSubmit` handler to POST to [/api/movies](src/app/api/movies/route.ts), handle validation errors, show success/error messages, and redirect to the new movie page on success.

## Further Considerations

1. **Slug generation**: ✅ **DECIDED** — Create utility function `generateSlug(movieName: string, watchDate: string)` that generates format `{year}-{kebab-case-movie-name}` (e.g., `2025-materialists`). Extract year from watch_date field, convert movie name to lowercase with spaces replaced by hyphens, remove special characters. Slug field should be auto-populated but editable.
2. **Array field handling**: ✅ **DECIDED** — Convert director/cast/genre arrays from TMDB to comma-separated strings in the auto-populate function. TMDB data fields should be fully auto-populated from search results and not require manual editing (though slug remains editable as per #1).
3. **Validation requirements**: ✅ **DECIDED** — All form inputs are required. Rating select options: Great/Good/Ok/Bad/Absolute Trash. Picked select options: None/Craig/Rebecca.
