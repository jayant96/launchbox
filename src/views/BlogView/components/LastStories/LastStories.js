import React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'

const LastStories = ({ latestArticles }) => {
  const theme = useTheme()
  return (
    <Box>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        marginBottom={4}
      >
        <Box>
          <Typography fontWeight={700} variant={'h6'} gutterBottom>
            Latest Blogs
          </Typography>
          <Typography color={'text.secondary'}>Here’s what we’ve been up to recently.</Typography>
        </Box>
        <Box display='flex' marginTop={{ xs: 2, md: 0 }}>
          <Box component={Button} variant='outlined' color='primary' size='large' marginLeft={2}>
            View all
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            width: '2px'
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 2px grey'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'darkgrey',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            width: '4px',
            background: '#000000'
          }
        }}
      >
        {latestArticles &&
          latestArticles.map((article, index) => (
            <Box key={index} sx={{ minWidth: { xs: '100%', sm: '50%', md: '33.33%' }, padding: 2 }}>
              <Box
                component={'a'}
                href={`/blogArticle/${article.fields.slugName}`}
                display={'block'}
                width={1}
                height={1}
                sx={{
                  textDecoration: 'none',
                  transition: 'all .2s ease-in-out',
                  '&:hover': {
                    transform: `translateY(-${theme.spacing(1 / 2)})`
                  }
                }}
              >
                <Box
                  component={Card}
                  width={1}
                  height={1}
                  boxShadow={4}
                  display={'flex'}
                  flexDirection={'column'}
                  sx={{ backgroundImage: 'none' }}
                >
                  <CardMedia
                    image={article.fields.image1[0].url}
                    title={article.fields.blogName}
                    sx={{
                      height: { xs: 300, md: 360 },
                      position: 'relative'
                    }}
                  >
                    <Box
                      component={'svg'}
                      viewBox='0 0 2880 480'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        color: theme.palette.background.paper,
                        transform: 'scale(2)',
                        height: 'auto',
                        width: 1,
                        transformOrigin: 'top center'
                      }}
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M2160 0C1440 240 720 240 720 240H0v240h2880V0h-720z'
                        fill='currentColor'
                      />
                    </Box>
                  </CardMedia>
                  <Box component={CardContent} position={'relative'}>
                    <Typography variant={'h6'} gutterBottom>
                      {article.fields.blogName}
                    </Typography>
                    <Typography color='text.secondary'>{article.fields.smallIntroduction}</Typography>
                  </Box>
                  <Box flexGrow={1} />
                  <Box padding={2} display={'flex'} flexDirection={'column'}>
                    <Box marginBottom={2}>
                      <Divider />
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Box display={'flex'} alignItems={'center'}>
                        <Typography color={'text.secondary'}>{article.fields.authorName}</Typography>
                      </Box>
                      <Typography color={'text.secondary'}>{article.fields.date}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default LastStories
