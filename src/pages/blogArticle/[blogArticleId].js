import React from 'react'
import BlogArticle from 'src/views/BlogArticle'
import Airtable from 'airtable'
import { useRouter } from 'next/router'

export const getServerSideProps = async () => {
  var base = new Airtable({ apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN }).base('appZF3lXw44wVKqkS')

  let recordsArr = []

  await new Promise((resolve, reject) => {
    base('Assistivai')
      .select({
        maxRecords: 10,
        view: 'Grid view'
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(function (record) {
            // Only select the properties we're interested in
            recordsArr.push({
              id: record.id,
              fields: record.fields
            })
          })
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            console.error(err)
            reject(err)
            return
          }

          resolve()
        }
      )
  })

  return {
    props: {
      records: recordsArr
    }
  }
}

const BlogArticlePage = ({ records }) => {
  const router = useRouter()
  const { blogArticleId } = router.query

  let blogPageArticle = records.filter(record => record.fields.slugName === blogArticleId)

  console.log('Article Data', blogPageArticle)

  blogPageArticle = blogPageArticle[0]

  return <BlogArticle blogPageArticle={blogPageArticle} />
}

export default BlogArticlePage
