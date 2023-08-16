import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Button,
  Typography,
  Modal,
  Pagination,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { BsFileEarmarkPost } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { BiSolidPencil } from 'react-icons/bi';
import './App.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#ffffff1f',
  boxShadow: 24,
  p: 4,
  backdropFilter: 'blur(3px)',
  borderRadius: '25px',
};

const modalStyle = {
  background: '#6e6e8345',
};

const App = () => {
  const [Posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [NewPost, setNewPost] = useState({ title: '', body: '' });
  const [EditPost, setEditPost] = useState({ id: null, body: '', title: '' });
  const [editModal, setEditModal] = useState(false);

  const handleOpen = () => setOpenPostModal(true);
  const handleClose = () => setOpenPostModal(false);

  const fetchPosts = async () => {
    let response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    setPosts(response.data);
  };

  const handleShowEditModal = (post) => {
    setEditPost(post);
    setEditModal(true);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post('https://jsonplaceholder.typicode.com/posts', NewPost);
      setPosts([...Posts, response.data]);
      setNewPost({ title: '', body: '' });
      setOpenPostModal(false);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/posts/${EditPost.id}`, EditPost);
      const updatedPosts = Posts.map((post) => (post.id === EditPost.id ? EditPost : post));
      setPosts(updatedPosts);
      setEditModal(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      const updatedPosts = Posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = Posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="App">
      <Modal
        open={openPostModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        sx={modalStyle}
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="form" onSubmit={handleSubmitPost}>
            <div className="title">Create New Post....</div>
            <input
              type="text"
              placeholder="Enter Title"
              onChange={(event) => setNewPost({ ...NewPost, title: event.target.value })}
              value={NewPost.title}
              name="title"
              className="input"
            />
            <textarea
              placeholder="Your Post Body"
              onChange={(event) => setNewPost({ ...NewPost, body: event.target.value })}
              value={NewPost.body}
              name="body"
              className="input"
            />
            <button type="submit">Submit</button>
          </form>
        </Box>
      </Modal>
      <Modal
        open={editModal}
        onClose={() => setEditModal(false)}
        aria-labelledby="modal-modal-title"
        sx={modalStyle}
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="form" onSubmit={handleUpdatePost}>
            <div className="title">Edit The post</div>
            <input
              type="text"
              placeholder="Enter Title"
              onChange={(event) => setEditPost({ ...EditPost, title: event.target.value })}
              value={EditPost.title}
              name="title"
              className="input"
            />
            <textarea
              placeholder="Your Post Body"
              onChange={(event) => setEditPost({ ...EditPost, body: event.target.value })}
              value={EditPost.body}
              name="body"
              className="input"
            />
            <button type="submit">Submit</button>
          </form>
        </Box>
      </Modal>

      <Container maxWidth="lg">
        <h1>JSONPlaceholder CRUD App</h1>

        <Box className="crud-table" sx={{ bgcolor: '#cfe8fc', minHeight: '100vh' }}>
          <Button
            variant="primary"
            className="button"
            style={{ background: '#eee', color: '#1e868d', border: '0', marginBottom: '20px' }}
            onClick={handleOpen}
          >
            Write New Post........... <BsFileEarmarkPost />
          </Button>
          <Table>
            <TableHead>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Actions</TableCell>
            </TableHead>
            <TableBody>
              {currentPosts.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.body}</TableCell>
                  <TableCell>
                    <Button
                      variant="info"
                      className="button"
                      style={{ backgroundColor: 'transparent', border: '0', color: 'rgb(26, 98, 97)' }}
                      onClick={() => handleShowEditModal(item)}
                    >
                      <BiSolidPencil />
                    </Button>
                    <Button
                      variant="danger"
                      style={{ backgroundColor: 'transparent', border: '0', color: 'red' }}
                      className="button"
                      onClick={() => handleDeletePost(item.id)}
                    >
                      <AiFillDelete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box style={{display:'flex',justifyContent:'flex'}}>
          <Pagination className='' style={{alignItems:'center'}}
            count={Math.ceil(Posts.length / postsPerPage)}
            size="medium"
            onChange={handlePageChange}
            page={currentPage}
          />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default App;
