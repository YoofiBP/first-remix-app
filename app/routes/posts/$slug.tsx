import {json, LoaderFunction, useLoaderData} from "remix";
import {getPost} from "~/post";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({params}) => {
    invariant(params.slug, 'No slug specified');
    return json(await getPost(params.slug))
}

export default function PostsSlug(){
    const {body} = useLoaderData();

    return (
        <main dangerouslySetInnerHTML={{__html: body}} />
    )
}