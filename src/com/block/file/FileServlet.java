package com.block.file;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class File
 */
@WebServlet("/File")
public class FileServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    public FileServlet() {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String relpath = request.getPathInfo();
        if (relpath != null) {
            relpath.replaceAll("\\.\\.", "");
        }
        File f = getFile("res" + request.getPathInfo());
        if (f == null || !f.isFile()) {
            append("{}", response.getWriter());
        } else {
            append(f, response.getWriter());
        }

        System.out.println(request.getParameter("save"));
        System.out.println(request.getPathInfo());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        System.out.println("FileServlet.doPost()" + this);
        System.out.println(getServletContext().getRealPath("index.jsp"));
    }

    private File getFile(String path) {
        File f = new File(getServletContext().getRealPath(path));
        return f.exists() ? f : null;
    }

    private File createFile(String path) throws IOException {
        File f = new File(getServletContext().getRealPath(path));
        if (!f.exists()) {
            File parent = f.getParentFile();
            if (parent != null) {
                parent.mkdirs();
            }
            f.createNewFile();
        }
        return f;
    }

    private void append(String str, PrintWriter writer) throws IOException {
        writer.write(str);
    }

    private void append(File f, PrintWriter writer) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(f), "utf-8"));
        char[] buffer = new char[1 << 12];
        int c = 0;
        while ((c = reader.read(buffer)) != -1) {
            writer.write(buffer, 0, c);
        }
        System.out.println();
    }
}
