-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Create RLS policies
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own wishlist items
CREATE POLICY "Users can view their own wishlist"
    ON wishlist
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for users to add items to their wishlist
CREATE POLICY "Users can add items to their wishlist"
    ON wishlist
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to remove items from their wishlist
CREATE POLICY "Users can remove items from their wishlist"
    ON wishlist
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX wishlist_user_id_idx ON wishlist(user_id);
CREATE INDEX wishlist_product_id_idx ON wishlist(product_id); 