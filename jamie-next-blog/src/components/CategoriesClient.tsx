"use client"
import React from 'react'
import Categories from './Categories'

export default function CategoriesClient({tags}:{tags:string[]}){
  return <Categories tags={tags} />
}
