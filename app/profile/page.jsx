'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Profile from '@components/Profile';
const ProfileView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setPosts(data);
    };
    if (session?.user.id) {
      console.log('effect ran');
      fetchPosts();
    }
  }, []);
  const handleEdit = (post) => {
    router.push(`update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post) => {
    const hasConfimed = confirm(
      'Selected Prompt will deleted , please confirm to proceed!'
    );
    if (hasConfimed) {
      try {
        await fetch(`api/prompt/${post._id.toString()}`, {
          method: 'DELETE',
        });
        const filteredPost = posts.filter((p) => p._id !== post._id);
        setPosts(filteredPost);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <Profile
      name={'My'}
      desc='Welcome! to your profile page'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default ProfileView;
