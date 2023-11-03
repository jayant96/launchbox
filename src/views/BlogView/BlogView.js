import React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

import Container from 'src/layouts/components/Container'
import { Hero, SearchBox, FeaturedArticle, LastStories, CaseStudies, PopularArticles, Newsletter } from './components'
import { TurnedInNotRounded } from '@mui/icons-material'

const BlogReachView = ({ records }) => {
  const theme = useTheme()

  console.log('Records:', records)

  let featuredArticles = records.filter(
    record => record.fields.featuredArticle == true && record.fields.visibility == true
  )
  let popularArticles = records.filter(
    record => record.fields.popularArticle == true && record.fields.visibility == true
  )
  let latestArticles = records.filter(record => record.fields.latestArticle == true && record.fields.visibility == true)
  let caseStudies = records.filter(record => record.fields.caseStudy == true && record.fields.visibility == true)

  return (
    <>
      <Box bgcolor={'alternate.main'} position={'relative'}>
        <Hero />
        <Container>
          <SearchBox />
        </Container>
        <Container>
          <FeaturedArticle featuredArticles={featuredArticles} />
        </Container>
        <Container paddingTop={'0 !important'}>
          <LastStories latestArticles={latestArticles} />
        </Container>
        <Container paddingTop={'0 !important'}>
          <CaseStudies caseStudies={caseStudies} />
        </Container>
        <Box paddingBottom={{ xs: 2, sm: 3, md: 4 }}>
          <Container paddingTop={'0 !important'}>
            <PopularArticles popularArticles={popularArticles} />
          </Container>
        </Box>
      </Box>
      <Container>
        <Newsletter />
      </Container>
    </>
  )
}

export default BlogReachView
