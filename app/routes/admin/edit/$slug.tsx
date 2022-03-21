import {ActionFunction, Form, json, LoaderFunction, redirect, useActionData, useLoaderData, useTransition} from "remix";
import invariant from "tiny-invariant";
import {createPost, getPost} from "~/post";

export const loader: LoaderFunction = async ({params}) => {
    console.log(params)
    invariant(params.slug, 'No slug specified');
    return json(await getPost(params.slug));
}

const postBodyIsValid = ({title, slug, markdown}: any) => {
    return title.length > 0 && typeof slug === 'string'&& slug.length > 0 && markdown.length > 0
}

export const action: ActionFunction = async ({request}) => {
    await new Promise((res) => setTimeout(res, 1500))

    const formData = await request.formData()

    const title = formData.get('title')?.toString();
    const slug = formData.get('slug')?.toString();
    const markdown = formData.get('markdown')?.toString();

    invariant(typeof title === 'string', 'Title Missing');
    invariant(typeof slug === 'string', 'Title Missing');
    invariant(typeof markdown === 'string', 'Title Missing');

    if(postBodyIsValid({title, slug, markdown})){
        await createPost({
            title,
            slug,
            markdown
        })
    }else {
        return json({
            error: 'Title, slug and markdown required'
        })
    }
    return redirect('/admin');

}

export default function EditPosts(){
    const post = useLoaderData();
    const transition = useTransition();
    const errors = useActionData();

    return (
        <Form key={post.slug} method={'post'}>
            <p>
            <label htmlFor={'title'}>
                Title:{" "}
                <input id={'title'} name={'title'} type={'text'} defaultValue={post.title} />
            </label>

            </p>
            <p>
            <label htmlFor={'slug'}>
                Slug:{" "}
                <input id={'slug'} name={'slug'} type={'text'} defaultValue={post.slug}/>
            </label>

            </p>
            <p>
            <label htmlFor={'markdown'}>
                Markdown:{" "}<br/>
                <textarea id={'markdown'} name={"markdown"} defaultValue={post.body} rows={20}/>
            </label>

            </p>
            <input type={'submit'} value={transition.submission ? 'Saving' : 'Save'}/>
            {errors && <p>{errors.error}</p>}
        </Form>
    )
}