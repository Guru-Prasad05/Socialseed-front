import React from "react";
import { logUserOut } from "../apollo.js";
import { gql, useQuery } from "@apollo/client";
import Photo from "../components/Feed/Photo.js";
import PageTitle from "../components/PageTitle.js";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      user {
        username
        avatar
      }
      file
      caption
      likes
      commentNumber
      comments {
        id
        user {
          username
          avatar
        }
        payload
        isMine
        createAt
      }
      createAt
      isMine
      isLiked
    }
  }
`;

export default function Home() {
  const { data } = useQuery(FEED_QUERY);
  return (
    <div>
      <PageTitle title={"Home"} />
      {data?.seeFeed?.map((photo) => (
        <Photo key={photo.id} {...photo} />
      ))}
    </div>
  );
}
