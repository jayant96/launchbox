import React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

const CaseStudies = ({ caseStudies }) => {
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
            Case studies
          </Typography>
          <Typography color={'text.secondary'}>In-depth looks at our work.</Typography>
        </Box>
        <Box display='flex' marginTop={{ xs: 2, md: 0 }}>
          <Box component={Button} variant='outlined' color='primary' size='large' marginLeft={2}>
            View all
          </Box>
        </Box>
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          maxHeight: 'calc(104vh - 100px)', // or replace with the desired max height
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {caseStudies &&
          caseStudies.map((article, index) => (
            <Grid item xs={12} key={index}>
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
                  justifyContent={{
                    xs: 'center',
                    md: index % 2 === 1 ? 'flex-end' : 'flex-start'
                  }}
                  sx={{
                    minHeight: 300,
                    backgroundImage: `url("${article.fields.image1[0].url}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&:after': {
                      position: 'absolute',
                      content: '" "',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      zIndex: 1,
                      background: '#161c2d',
                      opacity: 0.6
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      position: 'relative',
                      width: { xs: 1, md: '50%' },
                      height: 1,
                      padding: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      zIndex: 2
                    }}
                  >
                    <Box>
                      <Typography variant={'h5'} gutterBottom sx={{ color: 'common.white' }}>
                        {article.fields.blogName}
                      </Typography>
                      <Typography color='text.secondary' sx={{ color: 'common.white', opacity: 0.8 }}>
                        {article.fields.introduction}
                      </Typography>
                    </Box>
                    <Box>
                      <Divider
                        sx={{
                          marginY: 2,
                          borderColor: 'common.white',
                          opacity: 0.4
                        }}
                      />
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box display={'flex'} alignItems={'center'}>
                          <Typography color={'text.secondary'} sx={{ color: 'common.white', opacity: 0.8 }}>
                            {article.fields.authorName}
                          </Typography>
                        </Box>
                        <Typography color={'text.secondary'} sx={{ color: 'common.white', opacity: 0.8 }}>
                          {article.fields.date}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

export default CaseStudies
