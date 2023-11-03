import React, { Fragment } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'

import Container from 'src/layouts/components/Container'
import { Content, FooterNewsletter, Hero, SidebarArticles, SidebarNewsletter, SimilarStories } from './components'

const BlogArticle = ({ blogPageArticle }) => {
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true
  })

  const heroData = {
    blogName: blogPageArticle.fields.blogName,
    authorName: blogPageArticle.fields.authorName,
    date: blogPageArticle.fields.date
  }

  const markdown = blogPageArticle.fields.markDown

  return (
    <Fragment>
      <Box>
        <Hero heroData={heroData} />
        <Grid container>
          <Content contentData={markdown} />
        </Grid>
        <Box
          component={'svg'}
          preserveAspectRatio='none'
          xmlns='http://www.w3.org/2000/svg'
          x='0px'
          y='0px'
          viewBox='0 0 1920 100.1'
          sx={{
            marginBottom: -1,
            width: 1
          }}
        >
          <path fill={theme.palette.alternate.main} d='M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z'></path>
        </Box>
      </Box>
      <Box bgcolor={'alternate.main'}>
        <Container>
          <SimilarStories />
        </Container>
        <Container>
          <FooterNewsletter />
        </Container>
        <Box
          component={'svg'}
          preserveAspectRatio='none'
          xmlns='http://www.w3.org/2000/svg'
          x='0px'
          y='0px'
          viewBox='0 0 1920 100.1'
          sx={{
            marginBottom: -1,
            width: 1
          }}
        ></Box>
      </Box>
    </Fragment>
  )
}

export default BlogArticle
