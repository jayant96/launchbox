/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Box, Container, Typography, Paper, useTheme, useMediaQuery } from '@mui/material'
import gfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'

const Content = ({ contentData }) => {
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true
  })

  // console.log('ContentData as prop:', contentData)

  const testMarkdown =
    '![Some Description](https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb)'

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '24px' }}>
        <ReactMarkdown
          children={contentData}
          remarkPlugins={[gfm]} // Use the gfm plugin
          components={{
            img: ({ node, src, ...props }) => {
              return (
                <img
                  src={src}
                  {...props}
                  style={{ maxWidth: '100%', height: 'auto' }}
                  alt={node.alt || 'Markdown Image'}
                />
              )
            }
          }}
        />
      </Paper>
    </Container>
  )
}

export default Content
