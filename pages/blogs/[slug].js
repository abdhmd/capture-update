import { Header } from "../../components";
import { Container } from "../../components/content-styles/ContentStyles";
import { client } from "../../lib/client";
import { publishedAt } from "../../components/BlogsSection";


const Post = ({ post }) => {
  const text = post.body.map((content) => content.children);
  return (
    <Container>
      <Header
        heading={post.title}
        subHeading={`${post.name} | ${publishedAt(post.publishedAt)}`}
      />

      <section className="flex flex-col gap-2 py-6  md:py-8 lg:py-16">
        {text.map((paragraph, i) => {
          console.log(paragraph)
          return <p key={i}>{paragraph[0].text}</p>;
        })}
      </section>
    </Container>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
    slug {
      current
    }
  }
  `;

  const posts = await client.fetch(query);

  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "post" && slug.current == '${slug}'][0]{
    _id,
     title,
     subtitle,
     "name": author->name,
     "categories": categories[]-> {title},
     body,
     mainImage,
     publishedAt
  }`;

  const post = await client.fetch(query);

  return {
    props: { post },
  };
};

export default Post;
