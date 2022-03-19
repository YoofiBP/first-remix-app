import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter'
import invariant from 'tiny-invariant';
import {marked} from 'marked';
import {json} from "remix";

const postLocation = path.join(__dirname, '..', 'posts')

export type Post = { slug: string, title: string}
export type PostMarkDownAttributes = {title: string}
export type NewPost = Post & {
    markdown: string
}

const isValidPostAttributes = (attributes:any): attributes is PostMarkDownAttributes => {
    return attributes?.title;
}

export const getPosts = async () => {
    const postFiles = await fs.readdir(postLocation);
    const posts: Post[] = await Promise.all(postFiles.map(async (postFile) => {
        const fileData = await fs.readFile(path.join(postLocation, postFile), 'utf8');
        const {attributes} = parseFrontMatter<PostMarkDownAttributes>(fileData);
        invariant(isValidPostAttributes(attributes),`${postFile} has bad file meta data`);
        return {
            title: attributes.title,
            slug: postFile.replace(/.md/i, '')
        }
    }) )

    return posts;
}

export const getPost = async (slug: string) => {
    const postData = await fs.readFile(path.join(postLocation, `${slug}.md`), 'utf8');
    const {body, attributes} = parseFrontMatter<PostMarkDownAttributes>(postData)
    invariant(isValidPostAttributes(attributes), `${postLocation} has bad file meta data`)
    return {slug, title: attributes.title, body: marked.parse(body)}
}

export const createPost = async (post: NewPost) => {
    const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
    await fs.writeFile(path.join(postLocation, `${post.slug}.md`), md)
    return json(await getPost(post.slug))
}