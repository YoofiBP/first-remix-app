import {json, LoaderFunction, useLoaderData} from "remix";
import {getPost} from "~/post";
import invariant from "tiny-invariant";
import {marked} from "marked";

export const loader: LoaderFunction = async ({params}) => {
    invariant(params.slug, 'No slug specified');
    const postData = await getPost(params.slug)
    postData.body = marked.parse(postData.body)
    return json(postData)
}

export default function PostsSlug(){
    const {body} = useLoaderData();

    return (
        <main dangerouslySetInnerHTML={{__html: body}} />
    )
}