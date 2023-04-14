import { gql, useQuery } from '@apollo/client';
import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { useHistory } from 'react-router-dom';

const SEE_ALL_PHOTOS_QUERY=gql`
    query compass($lastId:Int){
        compass(lastId:$lastId){
          id
          file
          user{
            username
          }
          likes
          commentNumber

        }
    }

`


const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
  cursor:pointer;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ExploreContainer=styled.div``

export default function Explore() {
  const {data,loading}=useQuery(SEE_ALL_PHOTOS_QUERY)
  const history=useHistory()
  
  return (
    <ExploreContainer>
      <Grid>
        {data?.compass.map((photo) => (
          <Photo bg={photo.file} key={photo.id} onClick={()=>history.push(`/users/${photo.user.username}`)}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </ExploreContainer>
  )
}
